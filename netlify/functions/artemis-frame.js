exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Fetch the image from the VPS
    const response = await fetch('http://178.104.95.241:8080/artemis/frame.jpg', {
      method: 'GET',
      headers: {
        'User-Agent': 'Netlify-Function/1.0'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch image: ${response.statusText}`,
        headers: {
          'Content-Type': 'text/plain',
        },
      };
    }

    // Get the image buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Return the image with proper headers
    return {
      statusCode: 200,
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    };
  } catch (error) {
    console.error('Error fetching Artemis frame:', error);

    return {
      statusCode: 500,
      body: 'Internal Server Error: Failed to fetch mission frame',
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};