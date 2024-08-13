# UCODIA.SPACE 🚀

This is the repository for my personal website [ucodia.space](https://ucodia.space)

You will find here a collection of visual and experimental software all running on the web.

## Development

First you need to download the source code and install dependencies by running those commands in a terminal (one time setup).

``` bash
git clone https://github.com/Ucodia/ucodia.space.git
cd ucodia.space
npm i
```

Then whenever you want to start the web application, run the following command.

```bash
npm run dev
```

The website will be available at the following address: http://localhost:5173/

### Synchronizing the CDN

To push

```
aws s3 sync ./public/cdn/ s3://cdn.ucodia.space/ --exclude "*.DS_Store"
```

To pull

```
aws s3 sync s3://cdn.ucodia.space/ ./public/cdn/
```