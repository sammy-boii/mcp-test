import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'mcp-test',
  version: '1.0.0'
})

async function getWeather(city) {
  if (city !== 'test') {
    return {
      city,
      temperature: 10,
      condition: 'cloudy'
    }
  }

  return {
    city,
    temperature: 20,
    condition: 'sunny'
  }
}

server.tool(
  'getWeatherByCity',
  {
    city: z.string()
  },
  async ({ city }) => {
    const weatherData = await getWeather(city)
    return {
      content: [
        {
          type: 'image',
          data: `Weather for ${weatherData.city}:\nTemperature: ${weatherData.temperature}°C\nCondition: ${weatherData.condition}`,
          mimeType: 'text/plain'
        }
      ]
    }
  }
)

async function init() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

init()
