
import Breadcrumb from "@/components/sharedUi/Breadcrumb";



export default function Banner({imgpath,pagename}){
    return(
          <section
          style={{backgroundImage:`url(${imgpath})`}}
          
          className="  border-2 border-white homebanner relative overflow-hidden w-full  bg-cover bg-center  object-cover md:p-[70px] md:m-5   md:rounded-3xl before:absolute before:inset-0 before:bg-black/60  xxl:mx-10">
        
      <div className="container overflow-hidden relative py-20 md:p-20 text-white-1 sm:pt-25  ">
         
        <div className=" place-items-center  ">
          <div className="max-md:spt60px  flex-center  flex-col text-center   ">
            <h1 className="h1 mb-3  mt-3 font-medium capitalize  z-40  ">
            {pagename}
            </h1>
            
          
           
              <Breadcrumb/>
           
            
          </div>
        </div>
      
   
      </div>
    </section>
    )
}