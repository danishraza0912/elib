
import  {config}  from './src/config/config';
import app from './src/app'
import db from './src/config/db'
const startserver  = function()
{
    db()
    const PORT = config.port || 3000
    app.listen(PORT, ()=>{

        console.log(`Listening on PORT ${PORT}`);
        
    })
}
   
startserver()

