import Formfeild from "../sharedUi/Formfeild";

export default function UserInfo() {
    return(

        <section className=" container w-180 " >

            <main className=" flex flex-col gap-6 " >
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 " >
                    <Formfeild fieldName={"customer.firstName"} labelText={'First  Name'} placeholder="Enter your first name"  />
                    <Formfeild fieldName={'customer.lastName'} labelText={'Last  Name'} placeholder="Enter your last name"  />
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-6  " >
                    <Formfeild fieldName={'customer.email'} labelText={'Email'} placeholder="Enter your email"  />
                    <Formfeild fieldName={'customer.phoneNumber'} labelText={'Phone Number'} placeholder="Enter your phone number"  />
                </div>

            </main>

        </section>
    )
}