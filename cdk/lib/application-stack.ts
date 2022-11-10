import { Construct } from "constructs";
import {
  Distribution,
  OriginAccessIdentity,
  PriceClass,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import * as path from "path";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { APP_NAME } from "../bin/cdk";

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const applicationBucket = new Bucket(this, `${APP_NAME}Bucket`, {
      accessControl: BucketAccessControl.PRIVATE,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      `${APP_NAME}OriginAccessIdentity`
    );

    applicationBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, `${APP_NAME}Distribution`, {
      defaultRootObject: "index.html",
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: new S3Origin(applicationBucket, { originAccessIdentity }),
      },
    });

    new CfnOutput(this, `${APP_NAME}DistributionId`, {
      exportName: `${APP_NAME}DistributionId`,
      value: distribution.distributionId,
    });

    new CfnOutput(this, `${APP_NAME}DistributionDomainName`, {
      exportName: `${APP_NAME}DistributionDomainName`,
      value: distribution.domainName,
    });

    new BucketDeployment(this, `${APP_NAME}BucketDeployment`, {
      destinationBucket: applicationBucket,
      sources: [Source.asset(path.resolve(__dirname, "../../dist"))],
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
