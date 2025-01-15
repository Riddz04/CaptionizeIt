// export default function PageHeaders({
//     h1Text = 'Hello',
//     h2Text = 'Subheader',
// }){
//     return(
//         <section className="text-center ">
//             <h1 className="text-3xl mt-24 mb-0">
//             {h1Text}
//             </h1>
//             <h2 className="text-white/65 py-10">
//             {h2Text}
//             </h2>
//             </section>
//     );
// }
export default function PageHeaders({
    h1Text = 'Hello',
    h2Text = 'Subheader',
  }) {
    return (
      <section className="text-center mt-12 sm:mt-24 mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl" style={{textShadow: '1px 1px 0 rgba(0,0,0,.2)'}}>
          {h1Text}
        </h1>
        <h2 className="text-white/75 text-sm sm:text-base mt-4">
          {h2Text}
        </h2>
      </section>
    );
  }