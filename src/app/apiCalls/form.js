


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
