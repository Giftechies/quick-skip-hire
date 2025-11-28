
// "use client"

// import { use, useEffect, useState } from "react"
// import { Button } from "../ui/button"

 


// export default function MyProfile({user}){
//     const defaultvalue= {
//         firstName:'',
//         lastName:"",
//         email:"",
//         phoneNumber:"",
//     }
//     const [formData,setformData] = useState(defaultvalue)

// useEffect(()=>{
//     formData.firstName=user.firstName || ""
//     formData.lastName = user.lastName || ''
//     formData.email = user.email || ''
//     formData.phoneNumber = user.phoneNumber || ''
// },[])
    
//     const formHandler = (data)=>{
//         data.preventDefault()
//         console.log("ddd",formData);   
//     }
     
//     return(
//         <form  onSubmit={formHandler}  className="flex gap-4 flex-col" >
//           <div className=" flex  gap-6 " >
//               <Inputfeild type="text" name={formData.firstName} label="First Name" placeholder={'enter your first name'} setvalue={setformData}  />
//               <Inputfeild type="text" name={formData.lastName} label="Last Name" placeholder={'enter your last name'} setvalue={setformData}  />
//           </div>
//           <div className="flex gap-6" >
//               <Inputfeild type="text" name={formData.email} label="Email" placeholder={'enter your email'}  setvalue={setformData} />
//               <Inputfeild type="tel" name={formData.phoneNumber} label="Phone Number" placeholder={'enter your phone number'}  setvalue={setformData} />

//           </div> 

//           <Button type='submit' className={'w-fit'} >Update</Button>

//         </form>
//     )
// }

// const Inputfeild = ({type='text',name,label="",placeholder ,setvalue})=> <div className="w-full flex flex-col gap-2" >
//     <label htmlFor={name}>{label}</label>
//     <input onChange={(e)=>setvalue(e.target.value)} type={type} name={name} value={name} className=" p-2 border border-black rounded-md placeholder:text-black/80 text-black " />
// </div>
"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ProfileUpdate } from "@/app/apiCalls/form";

export default function MyProfile({ user,id }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const formHandler = async (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    const res = await ProfileUpdate(id,formData)

    console.log(res);
    

  };

  return (
    <form onSubmit={formHandler} className="flex gap-4 flex-col">
      <div className="flex gap-6">
        <InputField
          label="First Name"
          placeholder="enter your first name"
          name="firstName"
          type="text"
          value={formData.firstName}
          setValue={setFormData}
        />

        <InputField
          label="Last Name"
          placeholder="enter your last name"
          name="lastName"
          type="text"
          value={formData.lastName}
          setValue={setFormData}
        />
      </div>

      <div className="flex gap-6">
        <InputField
          label="Email"
          placeholder="enter your email"
          name="email"
          type="text"
          value={formData.email}
          setValue={setFormData}
        />

        <InputField
          label="Phone Number"
          placeholder="enter your phone number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          setValue={setFormData}
        />
      </div>

      <Button type="submit" className="w-fit">
        Update
      </Button>
    </form>
  );
  
}


const InputField = ({ type, name, label, placeholder, value, setValue }) => {
  const handleChange = (e) => {
    const val = e.target.value;

    setValue((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="p-2 border border-black rounded-md placeholder:text-black/80 text-black"
      />
    </div>
  );
};
