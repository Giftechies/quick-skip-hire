


export async function RequestOtp (email){
    try {
        const res = await fetch('/api/auth/otp/send', {
            method: 'POST',
            body: JSON.stringify({email}),
        })
        
        const data = await res.json()
        if (!res.ok) {
            return {
                success:false,
                message: data.message || 'Failed to request OTP'
            }
        }
        return {
            success:true,
            message: data.message || 'OTP sent successfully'
        }
        
    } catch (error) {
        return {
            success:false,
            message: error.message || 'Failed to request OTP'
        }
        
    }
}

export async function FetchpostCode() {
    try {
        const res = await fetch(`/api/form/postcode`, {
            method: "GET"
        })
        const data = await res.json()
        if (data) {
            return data

        }

    } catch (error) {
        console.log(error);


    }
}
export async function Fetchjobtype() {
    try {
        const res = await fetch(`/api/form/category`, {
            method: "GET",
        })
        const data = await res.json()
        if (data) {
            return data
        }
    } catch (error) {
        console.log(error);
    }
}

export async function Fetchextra() {
    try {
        const res = await fetch(`/api/form/extra`, {
            method: 'GET'
        })
        const data = await res.json()
        if (!data.success) {
            return data
        }
        return data

    } catch (error) {
        console.log(error);


    }
}

export async function Fetchrates() {
    try {

        const res = await fetch(`/api/form/rates`, {
            method: "GET"
        })
        const data = await res.json()


        if (!data.success) {
            console.error(data);

        }
        return data

    } catch (error) {
        console.log(error);


    }
}

export async function CreateTimeSlot(payload) {
    try {
        console.log(payload, 'createTimesloat 82');

        const res = await fetch(`/api/form/timeslot`, {
            method: "POST",
            cache: 'no-store',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if (!res.ok) {
            return {
                success: false,
                error: data.error || 'Failed to create time slot'
            }
        }
        return {
            success: true,
            data: data.data
        }



    } catch (error) {
        return {
            error: error.message,
            success: false

        }

    }
}

export async function FetchTimeSlots() {
    try {
        const res = await fetch(`/api/form/timeslot`, {
            method: "GET",
            cache: 'no-store'
        })
        const data = await res.json()
        if (!res.ok) {
            return {
                success: false,
                error: data.error || 'Failed to fetch time slots'
            }
        }
        return {
            success: true,
            data: data.data
        }

    } catch (error) {
        return {
            success: false,
            error: error.message
        }

    }
}
export async function UpdateTimeSlot(id, payload) {
    try {
        const res = await fetch(`/api/form/timeslot/${id}`, {
            method: "PATCH",
            cache: "no-store",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.error || "Failed to update time slot",
            };
        }

        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

export async function DeleteTimeSlot(id) {
    try {
        const res = await fetch(`/api/form/timeslot/${id}`, {
            method: "DELETE",
            cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.error || "Failed to delete time slot",
            };
        }

        return {
            success: true,
            message: data.message || "Time slot deleted",
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}


export async function createCheckoutSession(data){
    try {
        const res = await fetch('/api/checkout/session', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success:false,
                message: result.message || 'Failed to create Stripe session'
            }
        }
        return {
            success:true,
            url: result.url,
            sessionId: result.sessionId
        };

        
    } catch (error) {
        return {
            success:false,
            message: error.message || 'Failed to create Stripe session'
        }
        
    }
}

export async function ProfileUpdate(id,formData){
  
    try {

        const res = await fetch(`/api/user/${id}`,{
            method:"PUT",
            body: JSON.stringify(formData) ,
            headers:{
                'Content-Type':"applicaton/json"
            }
        })
        const data = await res.json()
        if(!res.ok){
            return{
                success:false,
                message:data.message
            }
        }

        return{
            success:true,
            message:data.message,
            data:data
        }
    } catch (error) {
        return{
            success:false,
            message:error.message || "update failed!!"
        }
        
    }
}

export async function ProfileFetch({id}){
  
    try {    
        const res = await fetch(`/api/user/${id}`,{
            method:"GET",
        })
        const data = await res.json()
        if(!res.ok){
            return{
                success:false,
                message:data.message
            }
        }
        return{
            success:true,
            message:data.message,
            data:data.user
        }
    } catch (error) {
        return{
            success:false,
            message:error.message || "update failed!!"
        }
        
    }
}

export async function fetchOrder(id){
    try {
        const res = await fetch(`/api/orders/${id}`)
        const data =await res.json();
        if(!res.ok){
            return{
                success:false,
                message:'order not fetch.Please try again!'
            }
        };
console.log(data,'order get');

        return {
                success:true,
                message:'order fetch successfully!',
                data:data.orders
            }
        
    } catch (error) {
          return{
            success:false,
            message:error.message || "something went worng!!"
        }
    }
}

export async function logout() {
    try {
        const res = await fetch('api/auth/logout',{
            method:"POST"
        })
        return {
            success:true,
            message:'logout successfully!'
        }
        
    } catch (error) {
           return{
            success:false,
            message:error.message || "something went worng!!"
        }
    }
    
}