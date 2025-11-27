export default function ProfileSideBar({components,currentStep,SetcurrentStep}){
return(
    <div className=" sticky top-10 p-4 h-fit shadow-2xs" >
      <div>
        
      </div>
      <div className="flex flex-col gap-4 " >
          {
            components?.map((item,idx)=>{
                const isActive = idx ===currentStep;
                return(
                    <div onClick={()=>SetcurrentStep(idx)} className={` cursor-pointer hover:bg-black/80 hover:text-white   ${isActive?"bg-black  text-white ":" bg-white text-black"}  px-12 rounded-md py-2 capitalize `} >
                        {item.label}
                    </div>
                )
            })
        }
      </div>
    
    </div>
)
}