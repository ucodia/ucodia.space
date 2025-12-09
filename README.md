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
rclone sync ./public/cdn/ cloudflare:ucodia-space-cdn --progress
```

To pull

```
rclone sync cloudflare:ucodia-space-cdn ./public/cdn/ --progress
```