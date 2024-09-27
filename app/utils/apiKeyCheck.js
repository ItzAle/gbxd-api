// app/utils/apiKeyCheck.js

import { supabase } from "../../lib/supabase";

export async function checkAndIncrementApiUsage(apiKey) {
  if (!apiKey) {
    return { error: "API key is required", status: 401 };
  }

  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from("api_keys")
    .select("current_month_usage, monthly_limit, is_unlimited")
    .eq("key", apiKey)
    .single();

  if (apiKeyError) {
    return { error: "Invalid API key", status: 401 };
  }

  if (
    !apiKeyData.is_unlimited &&
    apiKeyData.current_month_usage >= apiKeyData.monthly_limit
  ) {
    return { error: "Monthly API limit reached", status: 429 };
  }

  if (!apiKeyData.is_unlimited) {
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ current_month_usage: apiKeyData.current_month_usage + 1 })
      .eq("key", apiKey);

    if (updateError) {
      console.error("Error updating API usage:", updateError);
    }
  }

  return { success: true };
}
