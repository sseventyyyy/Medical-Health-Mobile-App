# Medical Health Mobile App

Дерматология клиникасына арналған мобильді қосымша (Skin First). Expo / React Native-те жазылған, дизайны Figma-дағы «Medical Health Mobile App · Dermatology App UI Kit» макетінен алынған.

Қазір қосымшада сервер жоқ: деректердің бәрі уақытша (мок), кіру формасы дұрыс толтырылса, кез келген деректермен кіруге болады.

## Технологиялар

- Expo SDK 58, React Native 0.88, React 19.3
- TypeScript (strict)
- Иконкалар: `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)
- Навигация кітапханасы әзірге жоқ — экрандар арасындағы өту өзіміз жазған қарапайым навигаторлар арқылы (төменде қараңыз)

## Қалай іске қосу керек

```bash
npm install
npx expo start
```

Телефонда **Expo Go** қосымшасын ашып, терминалдағы QR-кодты сканерлеңіз немесе `exp://<компьютердің IP-адресі>:8081` адресін енгізіңіз. Телефон мен компьютер бір Wi-Fi желісінде болуы керек.

Жаңа пакет қосқанда `npm install` емес, `npx expo install <пакет>` қолданыңыз — ол SDK 58-ге сай нұсқаны таңдайды.

## Қосымша қалай жұмыс істейді

```
Splash (1,5 сек) → Welcome ─ Log In ──→ Home
                            └ Sign Up → Set Password → Log In

Home ─ қоңырау        → Notification
     ─ тісті доңғалақ → Settings
     ─ төменгі мәзір  → Home · Chat · Profile · Calendar (әзірге жоқ)

Profile → Edit Profile · Privacy Policy · Settings · Help Center · Logout
Logout  → Welcome
```

## Папкалар құрылымы

```
App.tsx                      Splash → кіру → негізгі бөлім
login/                       Кіру бөлімі: Welcome, Log In, Hello!, Sign Up, Set Password
  AuthNavigator.tsx          кіру экрандарының навигаторы
  components/                AuthLayout, AuthInput, PrimaryButton, SocialButtons…
profile/                     Профиль бөлімі: 7 экран + Logout терезесі
  ProfileNavigator.tsx       профиль экрандарының навигаторы
  components/                ProfileLayout, MenuRow, Field, BottomTabBar…
src/
  MainNavigator.tsx          кіргеннен кейінгі бөлім: төменгі мәзір + Notification
  screens/
    SplashScreen.tsx         көк фондағы логотип
    DoctorsScreen.tsx        Home: сәлемдесу, күнтізбе, жазылу, дәрігерлер тізімі
    NotificationsScreen.tsx  хабарламалар
    ChatScreen.tsx           дәрігермен чат
  components/Logo.tsx        Skin First логотипі (көк және ақ нұсқасы)
```

Навигаторлар (`AuthNavigator`, `ProfileNavigator`, `MainNavigator`) экрандар тізімін `useState`-те сақтайды. Болашақта Expo Router-ге көшу жоспарда бар (`AGENTS.md` қараңыз).

## Не жасалды

| Figma бөлімі | Күйі |
|---|---|
| 1. Splash Screen | ✅ дайын |
| 2. Welcome Screen | ✅ дайын |
| 3. Login, Sign Up | ✅ Log In, Sign Up, Set Password. «Hello!» экраны жазылған, бірақ оған өтетін жол жоқ |
| 4. Home | ✅ дайын, қосылған |
| 5. Doctors, Favorite | ✅ тізім, таңдаулылар, Doctor Info (қарапайым нұсқа) |
| 6. Profile | ✅ 9 экранның бәрі |
| 7. Notifications, Chat | ✅ дайын |
| 8. Schedule | ⚠️ қарапайым нұсқа: күн мен уақыт таңдап жазылу (`BookingScreen`) |
| 9. Appointment | ⚠️ қарапайым нұсқа: Calendar қойындысы — Complete / Upcoming / Cancelled |
| 10. Payment | ⚠️ Payment Method және Add Card бар; төлемнің өзі жоқ |

### Соңғы қосылғандар

- **Splash** — көк фон, ақ логотип. 1,5 секундтан кейін немесе басқанда Welcome ашылады. Бұл қосымшаның ішіндегі экран: Expo Go нативті splash-ты көрсетпейді.
- **Welcome** — логотип, қысқа сипаттама, Log In және Sign Up батырмалары.
- **Notification** — хабарламалар күн бойынша топталған (Today, Yesterday, 15 April). Оқылмағаны көк фонмен ерекшеленеді, басқанда оқылды болады. «Mark all» бәрін оқылды етеді.
- **Chat** — дәрігермен хат алмасу: хабарлама жіберу, дауыстық хабарлама, «Dr. Olivia is typing…». Сервер жоқ болғандықтан, дәрігер 1,5 секундтан кейін дайын жауап жібереді.
- **Home** қосылды: қоңырау, тісті доңғалақ және төменгі мәзір жұмыс істейді.

«Раздел в разработке» деген түймелер қалған жоқ. Ортақ деректер (профиль, таңдаулылар, жазылулар, чаттар, карталар) `src/store.tsx` ішінде жадта сақталады және Logout кезінде бастапқы күйге қайтады.

Сервер болмағандықтан имитация болып қалғандары:

- **Қоңырау / видео** (`src/components/CallModal.tsx`) — тек экран мен таймер, нақты байланыс жоқ.
- **Дәрігердің дауыстық хабарламасы** — файлы жоқ, сондықтан тек прогресс жолағы жүреді. Өзіңіз жазған дауыс (`expo-audio`) шынымен жазылып, ойнатылады.
- **Google / Facebook / саусақ ізі** — бірден кіргізеді.
- **Forgot Password, Add Card** — тек форма тексеріледі, ешқайда жіберілмейді.

## Дизайн

Негізгі түстер `login/theme.ts` және `profile/theme.ts` файлдарында:

| Атауы | Түсі | Қайда |
|---|---|---|
| primary | `#2563FF` | батырмалар, тақырыптар, төменгі мәзір |
| primaryLight | `#EAF0FF` | енгізу өрістері |
| iconBg / socialBg | `#CFDBFF` | иконкалар фоны, оқылмаған хабарлама |
| text | `#111827` | негізгі мәтін |
| error | `#DC2626` | қателер |

Батырма бұрышы 24, өріс бұрышы 12. Экран тақырыбы: 18, жуан, көк түсті.

Логотип (`src/components/Logo.tsx`) пішіндерден жиналған. Figma-дан PNG немесе SVG экспорттасақ, тек осы файлды ауыстыру жеткілікті.

## Белгілі мәселелер

- `npx tsc --noEmit` бір қате береді: `paument/ee.tsx` жоқ `./shared` модулін импорттайды (ескі макет). Қосымшаның өз коды қатесіз.
- `doctorapp/`, `paument/`, `sgared/`, `shoudle/`, `appoint/` — HTML-мен жазылған ескі макеттер, қосымшада қолданылмайды. Оларды React Native-ке қайта жазу керек.
- Түймелер мен layout `login/` және `profile/` ішінде екі рет қайталанған — болашақта ортақ компоненттерге шығару керек.
- ESLint бапталмаған.

## Командаға ереже

- Коммит жасамас бұрын `git config user.name` және `git config user.email` өзіңіздікі екенін тексеріңіз — бөтен аккаунттан жіберіп алмау үшін.
- `.vs/` (Visual Studio файлдары) репозиторийге түспеуі керек.
- `git pull` конфликт берсе, ешнәрсені жоймай тұрып командамен ақылдасыңыз. `git push --force` жасамаңыз.
