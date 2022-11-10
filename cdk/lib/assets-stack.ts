import { Construct } from "constructs";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import * as path from "path";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { APP_NAME } from "../bin/cdk";

export class AssetsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const assetsBucket = new Bucket(this, `${APP_NAME}AssetsBucket`, {
      accessControl: BucketAccessControl.PRIVATE,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `${APP_NAME}OriginAccessIdentity`
    );

    assetsBucket.grantRead(originAccessIdentity);

    const distribution = Distribution.fromDistributionAttributes(
      this,
      `${APP_NAME}Distribution`,
      {
        distributionId: Fn.importValue(`${APP_NAME}DistributionId`),
        domainName: Fn.importValue(`${APP_NAME}DistributionDomainName`),
      }
    );

    new BucketDeployment(this, `${APP_NAME}ImagesBucketDeployment`, {
      destinationBucket: assetsBucket,
      sources: [Source.asset(path.resolve(__dirname, "../../images"))],
      contentType: "image",
      destinationKeyPrefix: "images",
      distribution: distribution,
      distributionPaths: ["/images/*"],
    });
  }
}
