


export default function ProfileSideBar({components,currentStep,SetcurrentStep,user}){



    return(
    <div className="sticky top-0 p-6 h-fit shadow-2xs flex flex-col gap-4 shrink-0 " >
      <div className="flex flex-col items-center  justify-center " >
        <div className="px-4 py-2 rounded-full bg-blue-200 border border-blue-200 uppercase font-serif text-[18px] " >{user?.firstName?.charAt(0)}</div>
        <span>{user.email}</span>
        
      </div>
      <hr />
      <div className="flex flex-col gap-4  " >
          {
            components?.map((item,idx)=>{
                const isActive = idx ===currentStep;
                return(
                    <div key={item.label} onClick={()=>SetcurrentStep(idx)} className={` cursor-pointer hover:bg-black/80 hover:text-white   ${isActive?"bg-black  text-white ":" bg-white text-black"}  px-12 rounded-md py-2 capitalize `} >
                        {item.label}
                    </div>
                )
            })
        }
      </div>
    
    </div>
)
}