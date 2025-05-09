import {setDeliveryAddressGQL} from '@/graphQl/queries/cart/setDeliveryAddress';
import {DeliveryAddressType} from '@/redux/shopping-cart-slice';
import {NextResponse} from 'next/server';

const MAGENTO_GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT as string;

interface CartResponse {
  data: {
    setShippingAddressesOnCart: {
      cart: {
        shipping_addresses: DeliveryAddressType[];
      };
    };
  };
}

export async function POST(req: Request) {
  try {
    const {
      cart_id,
      city,
      country_code,
      firstname,
      lastname,
      telephone,
      street,
      postcode,
    } = await req.json();
    const mutation = setDeliveryAddressGQL({
      cart_id,
      city,
      country_code,
      firstname,
      lastname,
      telephone,
      street,
      postcode,
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
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: 'Error adding product'}, {status: 500});
  }
}
