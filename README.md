I didn't manage to set up the Go/docker environment (I haven't used Go or Docker before). You can read the bottom of readme to see the problems & my plan for if I was able to get the environment set up correctly. So anyway I decided to just complete the front-end component of the test.

Setup steps assuming you already have node & npm installed (otherwise go get them first, heres a guide: https://docs.npmjs.com/getting-started/installing-node):

Once you are ready with node & npm installed, you will need the npm module "http-server" (https://www.npmjs.com/package/http-server). Run the following terminal commands whilst inside this directory:

npm install http-server -g

http-server -p 8080

Then go and visit http://localhost:8080 and you will see the Front-End. There is a table displaying the tickets with filters you can use to reduce/sort the ticket list.

go/docker environment config setup issues:

I think my $GOPATH isn't configured correctly. I couldn't use the command "go run main.go" for debugging as it produced this permission error: "listen tcp :80: bind: permission denied". Couldn't run "go get -v" either as it complained about the $GOPATH.

Here is what I would have done had I got the Go/Docker config set up correctly (this plan could be incorrect as I haven't used Go before):

- Get the baseHandler method to serve the HTML file (where my view logic would live)
- Add another route that just serves the JSON which is accessible from "/getJSON" (full URL: http://localhost:8080/getJSON)
- From there I could just AJAX request the JSON from the HTML page with the URL above.
