export const OTP_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>OTP Verification</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', sans-serif;
        background: #f6fafb;
      }

      table,
      td {
        border-collapse: collapse;
      }

      .container {
        width: 100%;
        max-width: 500px;
        margin: 70px 0px;
        background-color: #ffffff;
      }

      .main-content {
        padding: 48px 30px 40px;
        color: #000000;
      }

      .otp-box {
        background: #f1f1f1;
        padding: 20px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #4c83ee;
      }

      .note {
        font-size: 14px;
        color: #555;
        margin-top: 12px;
      }

      .button {
        display: inline-block;
        background: #4c83ee;
        color: white;
        text-decoration: none;
        padding: 10px 24px;
        font-weight: bold;
        border-radius: 6px;
        margin-top: 24px;
        font-size: 14px;
      }

      @media only screen and (max-width: 480px) {
        .container {
          width: 90% !important;
        }

        .otp-box {
          font-size: 20px;
        }
      }
    </style>
  </head>

  <body>
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f6fafb">
      <tr>
        <td align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td class="main-content">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding: 0 0 20px; font-size: 18px; font-weight: bold;">
                      Your One-Time Password (OTP)
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; line-height: 150%;">
                      Please use the OTP below to complete your verification process. This OTP is valid for the next 5 minutes.
                    </td>
                  </tr>
                  <tr>
                    <td class="otp-box">
                      {{otp}}
                    </td>
                  </tr>
                  <tr>
                    <td class="note">
                      If you didn't request this, please ignore this email.
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="{{supportLink}}" class="button">Need Help?</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
