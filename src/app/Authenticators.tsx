export default function Authenticators({ authenticators: auths }: Props) {
  if (auths.length < 1) {
    return (
      <div className='bg-gray-100 p-4 rounded m-4 text-gray-700 font-bold border'>
        Seems you don&apos;t have any authenticator yet, kindly press the plus
        icon to create one.
      </div>
    );
  }

  return <div>{JSON.stringify(auths)}</div>;
}

interface Props {
  authenticators: Authenticator[];
}
