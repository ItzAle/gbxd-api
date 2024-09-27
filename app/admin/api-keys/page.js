"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

export default function ApiKeysAdmin() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState(1000);
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    const { data, error } = await supabase.from("api_keys").select("*");
    if (error) console.error("Error fetching API keys:", error);
    else setApiKeys(data);
  }

  async function generateNewKey() {
    const response = await fetch("/api/generate-api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: newKeyDescription,
        is_unlimited: isUnlimited,
        monthly_limit: isUnlimited ? null : newKeyLimit,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      }),
    });

    if (response.ok) {
      fetchApiKeys();
      setNewKeyDescription("");
      setNewKeyLimit(1000);
      setIsUnlimited(false);
    } else {
      console.error("Error generating new API key");
    }
  }

  return (
    <div>
      <h1>API Keys Management</h1>

      <div>
        <TextField
          label="Description"
          value={newKeyDescription}
          onChange={(e) => setNewKeyDescription(e.target.value)}
        />
        <TextField
          type="number"
          label="Monthly Limit"
          value={newKeyLimit}
          onChange={(e) => setNewKeyLimit(parseInt(e.target.value))}
          disabled={isUnlimited}
        />
        <label>
          <input
            type="checkbox"
            checked={isUnlimited}
            onChange={(e) => setIsUnlimited(e.target.checked)}
          />
          Unlimited
        </label>
        <Button onClick={generateNewKey}>Generate New API Key</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Is Unlimited</TableCell>
            <TableCell>Monthly Limit</TableCell>
            <TableCell>Current Usage</TableCell>
            <TableCell>Last Used</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.key}</TableCell>
              <TableCell>{key.description}</TableCell>
              <TableCell>{key.is_unlimited ? "Yes" : "No"}</TableCell>
              <TableCell>{key.monthly_limit}</TableCell>
              <TableCell>{key.current_month_usage}</TableCell>
              <TableCell>
                {new Date(key.last_used_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
