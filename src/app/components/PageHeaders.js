export default function PageHeaders({
    h1Text = 'Hello',
    h2Text = 'Subheader',
}){
    return(
        <section className="text-center ">
            <h1 className="text-3xl mt-24 mb-0">
            {h1Text}
            </h1>
            <h2 className="text-white/65 py-10">
            {h2Text}
            </h2>
            </section>
    );
}