aws s3 sync ./dist s3://ucodia.space
aws cloudfront create-invalidation --distribution-id E58UWXWVZAUQ7 --paths "/*"