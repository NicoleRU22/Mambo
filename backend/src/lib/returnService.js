export async function requestReturn(data) {
  const { reason, orderItemId, userId } = data;
  const res = await fetch("/api/returns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear la solicitud");
  return res.json();
}
