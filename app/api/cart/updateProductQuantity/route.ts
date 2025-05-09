import {NextResponse} from 'next/server';
import {updateProductQuantityGQL} from '@/graphQl/queries/cart/updateProductQuantity';
import {ProductCartMenuPropsType} from '@/components/Basket/CartMenu/ProductCartMenu/ProductCartMenu';

const MAGENTO_GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT as string;

interface CartResponse {
  data: {
    updateCartItems: {
      cart: {
        id: string;
        prices: {
          grand_total: {
            value: number;
            currency: string;
          };
        };
        items: ProductCartMenuPropsType[];
      };
    };
  };
}

export async function POST(req: Request) {
  try {
    const {cart_id, cart_item_uid, quantity} = await req.json();
    const mutation = updateProductQuantityGQL({
      cart_id,
      cart_item_uid,
      quantity,
    });
    // console.log(mutation)
    const response = await fetch(MAGENTO_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: mutation}),
    });

    const data: CartResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: 'Error adding product'}, {status: 500});
  }
}
