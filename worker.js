export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = "https://gateway.apiportal.ns.nl" + url.pathname + url.search;

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Ocp-Apim-Subscription-Key, Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const upstream = await fetch(target, {
      headers: { "Ocp-Apim-Subscription-Key": request.headers.get("Ocp-Apim-Subscription-Key") || "" }
    });
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": upstream.headers.get("Content-Type") || "application/json" }
    });
  }
}
