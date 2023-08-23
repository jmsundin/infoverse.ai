import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const requestBody = req.body;
    const msg = {
      to: "jon@infoverse.ai",
      from: "jon@infoverse.ai",
      subject: requestBody.subject,
      text: requestBody.message,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html lang="en">
      <body>
        <div class="img-container" style="display: flex;justify-content: center;align-items: center;border-radius: 5px;overflow: hidden; font-family: 'helvetica', 'ui-sans';">
              </div>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
              <h3>From: ${requestBody.email}</h3>
              <div style="font-size: 16px;">
              <p>Subject: ${requestBody.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${requestBody.message}</p>
              <br>
              </div>
              </div>
              </div>
      </body>
      </html>`,
    };

    try {
      await sendgrid.send(msg);
    } catch (error) {
      console.error(error);
      console.log(error.response.body);
      return res
        .status(error.status || 500)
        .json({ status: error.statusCode, message: `${error.message} line 61 error`, body: { ...error.body } });
    }

    res.status(200).json({
      status: "OK",
      message: `Email sent successfully, ${requestBody.name}!`,
    });
  }
}