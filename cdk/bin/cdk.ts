#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApplicationStack } from "../lib/application-stack";
import * as dotenv from "dotenv";
import { AssetsStack } from "../lib/assets-stack";

dotenv.config();

export const APP_NAME = process.env.APP_NAME;
const REGION = process.env.REGION;
const ACCOUNT = process.env.ACCOUNT;

const app = new cdk.App();

new ApplicationStack(app, `${APP_NAME}Stack`, {
  env: { account: `${ACCOUNT}`, region: `${REGION}` },
});

new AssetsStack(app, `${APP_NAME}AssetsStack`, {
  env: { account: `${ACCOUNT}`, region: `${REGION}` },
});
