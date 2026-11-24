"use client";
import { createAuthClient } from "better-auth/react";
import { anonymousClient, phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({ plugins: [phoneNumberClient(), anonymousClient()] });
