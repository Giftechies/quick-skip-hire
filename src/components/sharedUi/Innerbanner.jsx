
import Breadcrumb from "@/components/sharedUi/Breadcrumb";



export default function Banner({imgpath,pagename}){
    return(
          <section className=" relative inner-banner z-0  p-5 w-[95%] rounded-xl mx-auto mt-8 h-96 border-2   bg-no-repeat bg-center bg-cover overflow-hidden " style={{backgroundImage:`url(${imgpath || "/banner/inner-banner.avif"})`}}>
            <div className=" absolute inset-0 -z-10 bg-black/50 " />
            <div className=" container  h-full flex flex-col items-center justify-center " >
              <h2 className="text-4xl font-bold text-white mb-4 capitalize ">{pagename || "Page NOt found"}</h2>
              <Breadcrumb  />
            </div>


          </section>
    )
}