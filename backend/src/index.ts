import app from './app'
import { env } from './config/env'

app.listen(env.port, () => {
  console.log(`🚀 TechGear API running at http://localhost:${env.port}`)
  console.log(`   Environment: ${env.nodeEnv}`)
  console.log(`   Gemini model: ${env.gemini.model}`)
})
