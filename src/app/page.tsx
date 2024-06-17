import React from 'react';
import Counter from './counter';

export default function Page() {
  return (
    <main className='m-4 max-w-screen-sm mx-4 md:mx-auto'>
      <h1 className='font-extrabold text-2xl'>Hello, World!</h1>
      <p className=' my-4 text-gray-500 bg-secondary p-4 rounded'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
        debitis sunt ex totam mollitia excepturi dolor, dolore quidem officiis
        aperiam laboriosam! Nesciunt obcaecati dicta blanditiis architecto
        saepe. Eaque, obcaecati vitae.
      </p>
      <div className='flex justify-end'>
        <Counter />
      </div>
    </main>
  );
}
