import mongoose from "mongoose"
import dns from "dns"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

   async function connecttodb(){
    await mongoose.connect(process.env.mongo_uri)
    
        console.log("connect to db")
   
}
export default connecttodb;