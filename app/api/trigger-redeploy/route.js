import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.VERCEL_DEPLOY_HOOK_URL) {
    console.warn("VERCEL_DEPLOY_HOOK_URL no está configurada");
    return NextResponse.json({ message: "Redeploy no configurado" }, { status: 200 });
  }

  try {
    const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
      method: "POST",
    });

    if (response.ok) {
      return NextResponse.json({ message: "Redeploy iniciado con éxito" }, { status: 200 });
    } else {
      throw new Error("Error al iniciar el redeploy");
    }
  } catch (error) {
    console.error("Error al activar el redeploy:", error);
    return NextResponse.json({ error: "Error al activar el redeploy" }, { status: 500 });
  }
}
