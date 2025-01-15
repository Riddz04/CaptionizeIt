import PageHeaders from "../../components/PageHeaders";

export default function PricingPage(){
    return(
        <div>
            <PageHeaders 
            h1Text="Check out our Pricing!!"
            h2Text="Our Pricing is very Simple"
            />
            <div
            className="bg-white text-slate-700 rounded-lg max-w-xs mx-auto p-4 text-center">
                <h3 className="font-bold text-2xl">Free</h3>
                <h4>Free Forever</h4>
            </div>
        </div>
    );
}