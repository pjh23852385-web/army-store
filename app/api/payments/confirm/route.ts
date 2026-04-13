export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();

  const secretKey = process.env.TOSS_SECRET_KEY || "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
  const encryptedSecretKey = Buffer.from(secretKey + ":").toString("base64");

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encryptedSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { message: data.message || "결제 승인에 실패했습니다.", code: data.code },
      { status: response.status }
    );
  }

  return Response.json(data);
}
