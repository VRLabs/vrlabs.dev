<div align="center">

# vrlabs.dev

[![Generic badge](https://img.shields.io/discord/706913824607043605?color=%237289da&label=DISCORD&logo=Discord&style=for-the-badge)](https://discord.vrlabs.dev/)
[![Generic badge](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dvrlabs%26type%3Dpatrons&style=for-the-badge)](https://patreon.vrlabs.dev/)

![Homepage](https://github.com/VRLabs/vrlabs.dev/assets/101019309/63ba3f70-c0f8-422b-9f67-fd32440ec176)

</div>

---

## URL parameters

The packages page uses a few query parameters, all of which accept the parameter multiple times or a comma separated list:

| Parameter    | Effect                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- |
| `?package=`  | Opens the Creator Companion with a listing containing these packages and their dependencies. |
| `?category=` | Opens the Creator Companion with the listing of these categories.                            |
| `?cart=`     | Adds these packages to the VCC list on the page instead.                                     |

## Running locally

Requires Node 24 and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev        # dev server on http://localhost:5173
pnpm build      # production build into build/
pnpm start      # run the production build
pnpm check      # type-check the Svelte code
pnpm lint       # prettier and eslint
pnpm format     # format everything
```

### Environment variables

Copy `.env.example` to `.env` and edit the values:

| Variable       | Purpose                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `API_URL`      | Base URL of the VRLabs package API, defaults to `https://api.vrlabs.dev`. Point it at the test API while developing. |
| `ORIGIN`       | Public origin of the site, used for canonical URLs.                                                                  |
| `GITHUB_TOKEN` | Optional fine-grained personal access token so download counts can be fetched more often.                            |
| `PORT`         | Port of the Node server, defaults to 3000.                                                                           |

To create the GitHub token open _Settings › Developer settings › Personal access tokens › Fine-grained tokens_, generate a token with **Public repositories (read-only)** access, and set it as `GITHUB_TOKEN`. Release download counts are cached for two hours, so the site stays well below the limit even without one.

## Deployment

`compose.yaml` builds the site with the `Dockerfile` and runs it with `node build`. It reads the environment variables above from `.env`, where `PORT` is the port published on the host:

```sh
docker compose up -d --build
docker compose logs -f
```

To update, pull the new code and run `docker compose up -d --build` again. The container has a health check on `/`, so `docker compose ps` shows whether the site is serving.

​

<div align="center">

[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/VRLabs.png" width="50" height="50">](https://vrlabs.dev 'VRLabs')
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Discord.png" width="50" height="50">](https://discord.vrlabs.dev/ 'VRLabs')
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Patreon.png" width="50" height="50">](https://patreon.vrlabs.dev/ 'VRLabs')
<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Empty.png" width="10">
[<img src="https://github.com/VRLabs/Resources/raw/main/Icons/Twitter.png" width="50" height="50">](https://twitter.com/vrlabsdev 'VRLabs')

</div>
