<h1>API Tester</h1>



<p>
A simple Postman-like web application built using React that allows users to send HTTP requests and view responses in a clean interface.
</p>

<h2>Features</h2>
<ul>
  <li>Supports HTTP methods: GET, POST, PUT, DELETE</li>
  <li>Add and remove custom headers dynamically</li>
  <li>Supports request body for POST and PUT</li>
  <li>Authorization support:
    <ul>
      <li>Basic Auth</li>
      <li>Bearer Token</li>
    </ul>
  </li>
  <li>Displays response status, headers, and body</li>
  <li>Response view modes:
    <ul>
      <li>Raw JSON</li>
      <li>Table format</li>
    </ul>
  </li>
  <li>Shows response time</li>
  <li>Error handling for failed requests</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li>React (Functional Components + Hooks)</li>
  <li>Fetch API</li>
  <li>CSS</li>
</ul>

<h2>Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js</li>
  <li>npm or yarn</li>
</ul>

<h3>Installation</h3>
<pre><code>
git clone https://github.com/devLalit95/postman
cd postman
npm install
</code></pre>

<h3>Run the Application</h3>
<pre><code>
npm run dev
</code></pre>

<p>Open in browser:</p>
<p>http://localhost:5173</p>

<h2>Usage</h2>
<ol>
  <li>Select HTTP method (GET, POST, PUT, DELETE)</li>
  <li>Enter the API URL</li>
  <li>Add headers if required</li>
  <li>Add request body for POST/PUT</li>
  <li>Select authorization type if needed</li>
  <li>Click Send</li>
  <li>View response in Raw or Table format</li>
</ol>

<h2>Project Structure</h2>
<pre><code>
src/
  App.js
  App.css
  index.js
</code></pre>

<h2>Notes</h2>
<ul>
  <li>Default Content-Type is set to application/json for POST and PUT if not provided</li>
  <li>Response body is parsed as JSON when possible</li>
  <li>Table view works best for structured JSON data</li>
</ul>

<h2>Author</h2>
<p>Lalit</p>
