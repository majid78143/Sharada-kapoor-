Install Termux from a trusted source such as F-Droid/GitHub rather than random APK websites.

# FF GLORY Discord Reseller Bot

Ye Discord bot Android phone + Termux se manage kiya ja sakta hai. Bot FF GLORY reseller API ko secure server-side requests ke through use karta hai. Discord mein API key ya token kabhi show nahi hota.

## Important safety notes

- Paid commands `/like`, `/glory`, `/autolike`, aur `/panelkey` ko timeout ke baad automatically retry nahi kiya jata. Remote API ne request accept ki ho sakti hai.
- API documentation aur FF GLORY/Free Fire ke Terms of Service ko use karne se pehle verify karein.
- `.env` ko GitHub, Discord, screenshot ya public chat mein share na karein.
- Android 24/7 hosting guarantee nahi karta. Reliable production ke liye VPS use karein.

## Android + Termux setup

### Step 1: Termux install karein

Termux ko trusted source, jaise F-Droid ya official GitHub release, se install karein. Random APK website se install na karein.

Termux open karke neeche diye commands ek-ek karke type karein. Paste karne ke baad Enter press karein.

### Step 2: Packages update karein

```bash
pkg update && pkg upgrade
```

Ye Termux packages update karta hai. Agar confirmation aaye to `y` type karke Enter karein. Agar mirror/network error aaye to internet check karke command dobara chalayein.

### Step 3: Node.js, Git aur Nano install karein

```bash
pkg install nodejs git nano
```

Ye bot run karne ke liye Node.js, project download karne ke liye Git, aur files edit karne ke liye Nano install karta hai.

### Step 4: Installation check karein

```bash
node -v
npm -v
git --version
```

Har command ko version number dikhana chahiye. Agar `command not found` aaye to Step 3 dobara run karein.

### Step 5: Project folder mein jaayein

Agar GitHub repository use kar rahe hain:

```bash
git clone YOUR_REPOSITORY_URL
cd ff-glory-discord-bot
```

`YOUR_REPOSITORY_URL` ko apni actual repository URL se replace karein. Agar project files pehle se phone par hain:

```bash
cd ff-glory-discord-bot
```

### Step 6: Dependencies install karein

```bash
npm install
```

Isse `discord.js`, `axios`, `dotenv` aur development ke liye `nodemon` install honge. Agar `Cannot find module` aaye to isi folder mein `npm install` dobara run karein.

## Configuration

### Step 7: Environment file banayein

```bash
cp .env.example .env
```

Ye example file ki private copy banata hai. Agar `cp` confusing ho, direct editor use karein:

```bash
nano .env
```

File mein ye values fill karein:

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
GUILD_ID=YOUR_TEST_SERVER_ID
FFGLORY_BASE_URL=https://ff-glory.xyz
FFGLORY_API_KEY=YOUR_FF_GLORY_API_KEY
```

- `DISCORD_TOKEN`: Discord Developer Portal ke Bot page ka token.
- `CLIENT_ID`: Discord application ka Application ID.
- `GUILD_ID`: Test Discord server ki ID. Isse commands test server mein jaldi update hote hain. Global deploy ke liye blank chhod sakte hain.
- `FFGLORY_API_KEY`: Apne FF GLORY reseller dashboard se generate ki hui key.

Nano mein:

- Text type/paste karein.
- `CTRL+O` save ke liye.
- Enter filename confirm karne ke liye.
- `CTRL+X` exit ke liye.

Android file editor ke through bhi project folder edit kar sakte hain. Paid editor required nahi hai; koi trusted Android code editor use karein jo hidden `.env` file ko preserve kare.

## Discord bot setup phone se

1. Phone browser mein Discord Developer Portal open karein.
2. New Application create karein.
3. **Bot** page kholkar **Add Bot** karein.
4. Bot token copy karein aur sirf `.env` mein rakhein.
5. **OAuth2 > URL Generator** kholein.
6. Scopes select karein: `bot` aur `applications.commands`.
7. Bot permissions mein sirf required permissions dein. Administrator unnecessarily select na karein.
8. Generated URL se bot ko apne test server mein invite karein.

## Commands deploy aur bot start

### Step 8: Slash commands deploy karein

```bash
npm run deploy
```

Expected output mein slash commands deployed message aayega. Agar commands Discord mein nahi dikhte, `CLIENT_ID`, `GUILD_ID` aur bot invite scopes check karein.

### Step 9: Bot start karein

```bash
npm start
```

Terminal mein `Discord bot ready` dikhna chahiye. Is Termux window ko open rakhein.

Development mode:

```bash
npm run dev
```

Code save karne par nodemon bot restart karega.

## Discord testing checklist

Discord mein ye commands test karein:

```text
/ping
/panel
/balance
/account
/like
/glory
/autolike
/panelkey
/orders
/groups
```

`/panel` private mobile-friendly buttons aur service select menu kholta hai. `/orders` mein Previous, Next, Refresh aur Close controls hain; sirf panel open karne wala user controls chala sakta hai. `/groups` mein destructive Delete action ke liye confirmation required hai.

## Commands ka overview

- `/like uid region` — instant likes.
- `/glory guild_uid region` — guild glory.
- `/autolike uid days region` — sirf 15 ya 30 days.
- `/panelkey hours` — current documented supported hours.
- `/balance` — live wallet.
- `/account` — live reseller account.
- `/orders` — live order history with pagination.
- `/groups` — active guild groups aur guild actions.
- `/help` — command list.
- `/ping` — bot health check.

## Termux mein bot ko running rakhna

- Termux ko force-close na karein.
- Android settings mein Termux ke liye battery optimization disable karna pad sakta hai.
- Phone sleep/background restrictions ki wajah se process stop ho sakta hai.
- Android phone par 24/7 operation guaranteed nahi hai.

## Recommended production setup: VPS

Android coding, testing, deployment, logs check karne aur VPS manage karne ke liye achha hai. Reliable 24/7 bot ke liye VPS use karein:

```text
Android Phone -> GitHub/Termux -> VPS -> Node.js -> Discord Bot -> FF GLORY API
```

Termux se VPS connect:

```bash
ssh username@SERVER_IP
```

`username` aur `SERVER_IP` ko apne VPS values se replace karein.

VPS par:

```bash
git clone YOUR_REPOSITORY_URL
cd ff-glory-discord-bot
npm install
nano .env
npm run deploy
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 status
pm2 logs ff-glory-bot
```

`ecosystem.config.js` mein secrets nahi hain; secrets sirf `.env` mein rakhein.

## Troubleshooting

### `node: command not found`

```bash
pkg install nodejs
node -v
```

### `npm: command not found`

Node.js install check karein:

```bash
pkg install nodejs
npm -v
```

### `Cannot find module`

Project folder ke andar:

```bash
npm install
```

### `.env not working`

```bash
nano .env
```

Variable names exact rakhein: `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `FFGLORY_BASE_URL`, `FFGLORY_API_KEY`. Values ke around extra quotes ya spaces avoid karein.

### Bot offline

```bash
npm start
```

Terminal ka error padhein. Token invalid ho to Developer Portal se token regenerate karke `.env` update karein.

### Slash commands missing

```bash
npm run deploy
```

Bot invite mein `applications.commands` scope, `CLIENT_ID` aur `GUILD_ID` check karein.

### API unauthorized

FF GLORY dashboard se API key status check karein. Key ko kabhi public chat mein paste na karein.

### Bot Termux close karne ke baad ruk gaya

Ye Android background limitation ho sakti hai. Termux open rakhein, battery optimization check karein, ya reliable operation ke liye VPS use karein.

## Mobile setup complete

- [ ] Termux installed
- [ ] Node.js installed
- [ ] Git installed
- [ ] Project created
- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] Discord bot created
- [ ] Discord bot invited
- [ ] Slash commands deployed
- [ ] `/panel` tested
- [ ] `/balance` tested
- [ ] API connection tested
- [ ] Error handling tested
- [ ] Bot running