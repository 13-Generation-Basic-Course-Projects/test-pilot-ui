"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { CodeSnippetUI } from "@/components/code-snippet/code-snippet-ui";
import { useRequestStore } from "@/store/request-url-slice";
import { useApiBodyStore } from "@/store/body-api-slice";
import { useHeaderStore } from "@/store/header-slice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<string>("curl");
  const { method, url } = useRequestStore();
  const { rawBody } = useApiBodyStore();
  const { headers } = useHeaderStore();

  const snippets = generateCodeSnippets(method || "GET", url || "", rawBody, headers);
  const selectedSnippet = snippets.find((snippet) => snippet.language === language);

  const handleCopy = () => {
    if (selectedSnippet?.copyCode) { // Use copyCode for clipboard
      navigator.clipboard.writeText(selectedSnippet.copyCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <div className="flex items-center flex-col gap-3">
      <div className="border rounded-md w-[30rem] p-2">
        <div className="flex items-center justify-between rounded-md focus:outline-none w-[100%] focus:ring-2 focus:ring-blue-100">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[135px] from-gray-100 to-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {snippets.map((snippet) => (
                  <SelectItem
                    key={snippet.language}
                    value={snippet.language}
                    className="hover:bg-gray-200 text-gray-900"
                  >
                    {snippet.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="relative">
            <Copy size={16} onClick={handleCopy} className="cursor-pointer" />
            {copied && (
              <span className="absolute top-[-20px] right-0 text-xs bg-gray-200 px-1 rounded">
                Copied!
              </span>
            )}
          </div>
        </div>
        <div className="max-w-lg max-h-[650px] overflow-auto">
          {selectedSnippet && (
            <CodeSnippetUI
              language={selectedSnippet.language}
              code={selectedSnippet.code} // Use code for display (masked)
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;

export interface CodeSnippet {
  language: string;
  label: string;
  code: string; // Display code with masked Authorization
  copyCode: string; // Copy code with actual Authorization
}

export const generateCodeSnippets = (
  method: string,
  url: string,
  rawBody: string | null,
  headers: { [key: string]: string } = {}
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
    formattedBody = "{}"; // Default to empty object if rawBody is null
  }

  // Create a display headers object where Authorization is replaced with '...'
  const displayHeaders = { ...headers };
  if (displayHeaders["Authorization"]) {
    displayHeaders["Authorization"] = "...";
  }

  const snippets: CodeSnippet[] = [
    {
      language: "curl",
      label: "cURL",
      code: `curl --location '${url}' \\
  -X ${method} \\
${Object.entries(displayHeaders)
          .map(([key, value]) => `  -H '${key}: ${value}' \\`)
          .join("\n")}  --dump-header - \\${formattedBody ? `\n  -d '${formattedBody}'` : ""}`,
      copyCode: `curl --location '${url}' \\
  -X ${method} \\
${Object.entries(headers)
          .map(([key, value]) => `  -H '${key}: ${value}' \\`)
          .join("\n")}  --dump-header - \\${formattedBody ? `\n  -d '${formattedBody}'` : ""}`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `const myHeaders = new Headers();
${Object.entries(displayHeaders)
          .map(([key, value]) => `myHeaders.append("${key}", "${value}");`)
          .join("\n")}

const raw = '${formattedBody}';

const requestOptions = {
  method: "${method}",
  headers: myHeaders,
${formattedBody !== "null" ? "  body: raw," : ""}
  redirect: "follow"
};

fetch("${url}", requestOptions)
  .then((response) => {
    console.log("Response Headers:");
    response.headers.forEach((value, name) => console.log(\`\${name}: \${value}\`));
    return response.text();
  })
  .then((body) => {
    console.log("Response Body:", body);
  })
  .catch((error) => console.error("Error:", error));`,
      copyCode: `const myHeaders = new Headers();
${Object.entries(headers)
          .map(([key, value]) => `myHeaders.append("${key}", "${value}");`)
          .join("\n")}

const raw = '${formattedBody}';

const requestOptions = {
  method: "${method}",
  headers: myHeaders,
${formattedBody !== "null" ? "  body: raw," : ""}
  redirect: "follow"
};

fetch("${url}", requestOptions)
  .then((response) => {
    console.log("Response Headers:");
    response.headers.forEach((value, name) => console.log(\`\${name}: \${value}\`));
    return response.text();
  })
  .then((body) => {
    console.log("Response Body:", body);
  })
  .catch((error) => console.error("Error:", error));`,
    },
    {
      language: "python",
      label: "Python",
      code: `import requests

url = "${url}"
${formattedBody ? `payload = ${formattedBody}` : "payload = {}"}
headers = {
${Object.entries(displayHeaders)
          .map(([key, value]) => `    "${key}": "${value}"`)
          .join(",\n")}
}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)
print("Response Headers:")
for key, value in response.headers.items():
    print(f"{key}: {value}")
print("Response Body:", response.text)`,
      copyCode: `import requests

url = "${url}"
${formattedBody ? `payload = ${formattedBody}` : "payload = {}"}
headers = {
${Object.entries(headers)
          .map(([key, value]) => `    "${key}": "${value}"`)
          .join(",\n")}
}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)
print("Response Headers:")
for key, value in response.headers.items():
    print(f"{key}: {value}")
print("Response Body:", response.text)`,
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
${Object.entries(displayHeaders)
          .map(([key, value]) => `        .header("${key}", "${value}")`)
          .join("\n")}
        .method("${method}", HttpRequest.BodyPublishers.ofString(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`
        ));
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("Response Headers:");
    response.headers().map().forEach((k, v) -> System.out.println(k + ": " + v));
    System.out.println("Response Body: " + response.body());
  }
}`,
      copyCode: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class Main {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
        .uri(URI.create("${url}"))
${Object.entries(headers)
          .map(([key, value]) => `        .header("${key}", "${value}")`)
          .join("\n")}
        .method("${method}", HttpRequest.BodyPublishers.ofString(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`
        ));
    HttpRequest request = requestBuilder.build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("Response Headers:");
    response.headers().map().forEach((k, v) -> System.out.println(k + ": " + v));
    System.out.println("Response Body: " + response.body());
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
${Object.entries(displayHeaders)
          .map(([key, value]) => `    client.DefaultRequestHeaders.Add("${key}", "${value}");`)
          .join("\n")}
    var content = new StringContent(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`, System.Text.Encoding.UTF8, "application/json");
    HttpResponseMessage response = await client.${method.charAt(0) + method.slice(1).toLowerCase()}Async("${url}", content);
    Console.WriteLine("Response Headers:");
    foreach (var header in response.Headers) {
        Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
    }
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Response Body: " + responseBody);
  }
}`,
      copyCode: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using HttpClient client = new HttpClient();
${Object.entries(headers)
          .map(([key, value]) => `    client.DefaultRequestHeaders.Add("${key}", "${value}");`)
          .join("\n")}
    var content = new StringContent(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`, System.Text.Encoding.UTF8, "application/json");
    HttpResponseMessage response = await client.${method.charAt(0) + method.slice(1).toLowerCase()}Async("${url}", content);
    Console.WriteLine("Response Headers:");
    foreach (var header in response.Headers) {
        Console.WriteLine($"{header.Key}: {string.Join(", ", header.Value)}");
    }
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Response Body: " + responseBody);
  }
}`,
    },
    {
      language: "html",
      label: "HTML",
      code: `<!-- HTML does not support direct HTTP requests. Use JavaScript or another language for API calls. -->
<p>Fetching ${url} with method ${method} requires a scripting language like JavaScript to handle headers, body, and response.</p>`,
      copyCode: `<!-- HTML does not support direct HTTP requests. Use JavaScript or another language for API calls. -->
<p>Fetching ${url} with method ${method} requires a scripting language like JavaScript to handle headers, body, and response.</p>`,
    },
    {
      language: "typescript",
      label: "TypeScript",
      code: `async function fetchData(): Promise<void> {
  try {
    const myHeaders = new Headers();
${Object.entries(displayHeaders)
          .map(([key, value]) => `    myHeaders.append("${key}", "${value}");`)
          .join("\n")}
    const response = await fetch("${url}", {
      method: "${method}",
      headers: myHeaders,
${formattedBody !== "null" ? `      body: \`
${formattedBody
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")}\`,` : ""}
      redirect: "follow" as RequestRedirect
    });
    console.log("Response Headers:");
    response.headers.forEach((value, name) => console.log(\`\${name}: \${value}\`));
    const text = await response.text();
    console.log("Response Body:", text);
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchData();`,
      copyCode: `async function fetchData(): Promise<void> {
  try {
    const myHeaders = new Headers();
${Object.entries(headers)
          .map(([key, value]) => `    myHeaders.append("${key}", "${value}");`)
          .join("\n")}
    const response = await fetch("${url}", {
      method: "${method}",
      headers: myHeaders,
${formattedBody !== "null" ? `      body: \`
${formattedBody
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")}\`,` : ""}
      redirect: "follow" as RequestRedirect
    });
    console.log("Response Headers:");
    response.headers.forEach((value, name) => console.log(\`\${name}: \${value}\`));
    const text = await response.text();
    console.log("Response Body:", text);
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
  content: "Cannot fetch ${url} with method ${method} using CSS. Use JavaScript or another language to handle headers, body, and response.";
}`,
      copyCode: `/* CSS does not support HTTP requests. Use a scripting language for API calls. */
body::after {
  content: "Cannot fetch ${url} with method ${method} using CSS. Use JavaScript or another language to handle headers, body, and response.";
}`,
    },
    {
      language: "go",
      label: "Go",
      code: `package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    client := &http.Client{}
    reqBody := []byte(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`)
    req, err := http.NewRequest("${method}", url, bytes.NewBuffer(reqBody))
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }
${Object.entries(displayHeaders)
          .map(([key, value]) => `    req.Header.Set("${key}", "${value}")`)
          .join("\n")}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error sending request:", err)
        return
    }
    defer resp.Body.Close()
    fmt.Println("Response Headers:")
    for key, values := range resp.Header {
        for _, value := range values {
            fmt.Println(key + ": " + value)
        }
    }
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }
    fmt.Println("Response Body:", string(body))
}`,
      copyCode: `package main

import (
    "bytes"
    "fmt"
    "io"
    "net/http"
)

func main() {
    url := "${url}"
    client := &http.Client{}
    reqBody := []byte(\`
${formattedBody
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n")}\`)
    req, err := http.NewRequest("${method}", url, bytes.NewBuffer(reqBody))
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }
${Object.entries(headers)
          .map(([key, value]) => `    req.Header.Set("${key}", "${value}")`)
          .join("\n")}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error sending request:", err)
        return
    }
    defer resp.Body.Close()
    fmt.Println("Response Headers:")
    for key, values := range resp.Header {
        for _, value := range values {
            fmt.Println(key + ": " + value)
        }
    }
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }
    fmt.Println("Response Body:", string(body))
}`,
    },
    {
      language: "php",
      label: "PHP",
      code: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_POSTFIELDS, '${formattedBody}');
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
${Object.entries(displayHeaders)
          .map(([key, value]) => `    "${key}: ${value}"`)
          .join(",\n")}
));
$response = curl_exec($ch);
if ($response === false) {
    echo "Error: " . curl_error($ch);
} else {
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    echo "Response Headers:\\n" . $headers . "\\n";
    echo "Response Body:\\n" . $body;
}
curl_close($ch);
?>`,
      copyCode: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_POSTFIELDS, '${formattedBody}');
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
${Object.entries(headers)
          .map(([key, value]) => `    "${key}: ${value}"`)
          .join(",\n")}
));
$response = curl_exec($ch);
if ($response === false) {
    echo "Error: " . curl_error($ch);
} else {
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    echo "Response Headers:\\n" . $headers . "\\n";
    echo "Response Body:\\n" . $body;
}
curl_close($ch);
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
${Object.entries(displayHeaders)
          .map(([key, value]) => `request["${key}"] = "${value}"`)
          .join("\n")}
request.body = '${formattedBody}'

response = https.request(request)
puts "Response Headers:"
response.each_header { |key, value| puts "#{key}: #{value}" }
if response.code.to_i >= 200 && response.code.to_i < 300
  puts "Response Body: #{response.body}"
else
  puts "Error: #{response.code} #{response.message}"
end`,
      copyCode: `require "uri"
require "json"
require "net/http"

url = URI("${url}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(url)
${Object.entries(headers)
          .map(([key, value]) => `request["${key}"] = "${value}"`)
          .join("\n")}
request.body = '${formattedBody}'

response = https.request(request)
puts "Response Headers:"
response.each_header { |key, value| puts "#{key}: #{value}" }
if response.code.to_i >= 200 && response.code.to_i < 300
  puts "Response Body: #{response.body}"
else
  puts "Error: #{response.code} #{response.message}"
end`,
    },
    {
      language: "nodejs",
      label: "Node.js",
      code: `const https = require('https');

const options = {
  method: '${method}',
  hostname: new URL('${url}').hostname,
  path: new URL('${url}').pathname,
  headers: {
${Object.entries(displayHeaders)
    .map(([key, value]) => `    '${key}': '${value}'`)
    .join(",\n")}
  }
};

const req = https.request(options, (res) => {
  console.log('Response Headers:');
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(key + ': ' + value);
  });
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

${formattedBody ? `req.write('${formattedBody}');` : ""}
req.end();`,
      copyCode: `const https = require('https');

const options = {
  method: '${method}',
  hostname: new URL('${url}').hostname,
  path: new URL('${url}').pathname,
  headers: {
${Object.entries(headers)
    .map(([key, value]) => `    '${key}': '${value}'`)
    .join(",\n")}
  }
};

const req = https.request(options, (res) => {
  console.log('Response Headers:');
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(key + ': ' + value);
  });
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

${formattedBody ? `req.write('${formattedBody}');` : ""}
req.end();`,
    },
  ];

  return snippets;
};