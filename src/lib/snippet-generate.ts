// lib/snippet-generator.ts
export interface CodeSnippet {
  language: string;
  label: string;
  code: string;
}

export const generateCodeSnippets = (
  method: string,
  url: string,
  rawBody: string | null
): CodeSnippet[] => {
  // Format the body if it exists, default to empty object if null
  let formattedBody: string | null = rawBody;
  if (rawBody) {
    try {
      formattedBody = JSON.stringify(JSON.parse(rawBody), null, 2);
    } catch {
      formattedBody = rawBody; // Fallback to raw if JSON parsing fails
    }
  } else {
    formattedBody = '{}'; // Default to empty object if rawBody is null
  }

  const snippets: CodeSnippet[] = [
    {
      language: "curl",
      label: "cURL",
      code: `curl --location '${url}'${method !== "GET" ? ` \\\n  -X ${method}` : ""}${
        rawBody
          ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d '${formattedBody}'`
          : ""
      }`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = ${formattedBody ? formattedBody : "null"};

const requestOptions = {
  method: "${method}",
  headers: myHeaders,
  ${formattedBody !== "null" ? "body: raw," : ""}
  redirect: "follow"
};

fetch("${url}", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`,
    },
    {
      language: "python",
      label: "Python",
      code: `import requests

url = "${url}"
${formattedBody ? `payload = ${formattedBody}` : "payload = {}"}
headers = {
    "Content-Type": "application/json"
}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)
print(response.json())`,
    },
    {
      language: "java",
      label: "Java",
      code: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class Main {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
        .uri(URI.create("${url}"))
        .header("Content-Type", "application/json")
        .method("${method}", HttpRequest.BodyPublishers.ofString(\`
${formattedBody
  .split('\n')
  .map(line => `  ${line}`)
  .join('\n')}\`
        ));
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.body());
  }
}`,
    },
    {
      language: "csharp",
      label: "C#",
      code: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using HttpClient client = new HttpClient();
    client.DefaultRequestHeaders.Add("Content-Type", "application/json");
    var content = new StringContent(\`
${formattedBody
  .split('\n')
  .map(line => `  ${line}`)
  .join('\n')}\`, System.Text.Encoding.UTF8, "application/json");
    HttpResponseMessage response = await client.${method.charAt(0) + method.slice(1).toLowerCase()}Async("${url}", content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
  }
}`,
    },
    {
      language: "html",
      label: "HTML",
      code: `<!-- HTML does not support direct HTTP requests. Use JavaScript or another language for API calls. -->
<p>Fetching ${url} requires a scripting language like JavaScript.</p>`,
    },
    {
      language: "typescript",
      label: "TypeScript",
      code: `async function fetchData(): Promise<void> {
  try {
    const response = await fetch("${url}", ${method === "GET"
      ? "{}"
      : `{
      method: "${method}",
      headers: {
        "Content-Type": "application/json"
      },
      body: \`
${formattedBody
  .split('\n')
  .map(line => `  ${line}`)
  .join('\n')}\`
    }`
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchData();`,
    },
    {
      language: "css",
      label: "CSS",
      code: `/* CSS does not support HTTP requests. Use a scripting language for API calls. */
body::after {
  content: "Cannot fetch ${url} with CSS. Use JavaScript or another language.";
}`,
    },
    {
      language: "go",
      label: "Go",
      code: `package main

import (
    "bytes"
    "fmt"
    "net/http"
)

func main() {
    url := "${url}"
    client := &http.Client{}
    reqBody := []byte(\`
${formattedBody
  .split('\n')
  .map(line => `  ${line}`)
  .join('\n')}\`)
    req, _ := http.NewRequest("${method}", url, bytes.NewBuffer(reqBody))
    req.Header.Set("Content-Type", "application/json")
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()
    fmt.Println("Response:", resp)
}`,
    },
    {
      language: "php",
      label: "PHP",
      code: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
${method !== "GET" ? `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");` : ""}
${formattedBody
  ? `curl_setopt($ch, CURLOPT_POSTFIELDS, ${formattedBody});
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));`
  : `curl_setopt($ch, CURLOPT_POSTFIELDS, '{}');
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));`
}
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    },
    {
      language: "ruby",
      label: "Ruby",
      code: `require "uri"
require "json"
require "net/http"

url = URI("${url}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(url)
request["Content-Type"] = "application/json"
request.body = JSON.dump(${formattedBody})

response = https.request(request)
puts response.read_body`,
    },
  ];

  return snippets;
};