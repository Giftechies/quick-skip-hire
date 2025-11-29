export default function orders(){
    const status = ['New',"pending",'Delivered']
    return(
        <section>

            <div>
                {
                    status.map(({item})=>{

                        return(
                            <div key={item} >{item}</div>
                        )
                    })
                }
            </div>

            


        </section>
    )
}