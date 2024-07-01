import app from './server/app'

import { connectToDatabase } from './database/config'

connectToDatabase();

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})