export const USER_CREATED_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Account Created</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #F6FAFB;
    }

    table, td {
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

    .info-box {
      background: #f9f9f9;
      border-radius: 6px;
      padding: 12px 15px;
      margin: 10px 0;
      font-size: 14px;
    }

    .label {
      font-weight: 600;
      color: #333;
    }

    .value {
      color: #4C83EE;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
      margin-top: 20px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 60% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tr>
      <td valign="top" align="center">
        <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="main-content">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                    Your account has been created successfully!
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                    An admin has created an account for you. You can log in using the credentials below:
                  </td>
                </tr>
                <tr>
                  <td class="info-box">
                    <div><span class="label">Username:</span> <span class="value">{{username}}</span></div>
                    <div><span class="label">Email:</span> <span class="value">{{email}}</span></div>
                    <div><span class="label">Password:</span> <span class="value">{{password}}</span></div>
                    <div><span class="label">Id:</span> <span class="value">{{id}}</span></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 10px; font-size: 14px; line-height: 150%; font-weight: 600;">
                    ⚠️ For your security, please update your password after your first login.
                  </td>
                </tr>
                <tr>
                  <td>
                   <a href="https://multitent-sys12.onrender.com/login" class="button">Login to Your Account</a>
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
