Run Tests
bash
npx wdio run wdio.conf.js

Run seperate test:
npx wdio run wdio.conf.js --spec ./test/specs/ios/alertViews.spec.js

Generate Report mochawesome:
bash
open test-report.html