import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class HelperService {
   
    public processBase64(base64String: string): string {
        try {
          if (base64String.startsWith('data:image')) {
            const pureBase64 = base64String.split(',')[1];
            if (!pureBase64) {
              throw new BadRequestException('Invalid Base64 string format.');
            }
            return pureBase64;
          }
    
          return base64String;
        } catch (error) {
          console.error("Error processing Base64 string:", error);
          throw new BadRequestException("Invalid Base64 string.");
        }
      }




    public cleanAndEscapeCode(code: string): string {
      let cleanedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return cleanedCode;
    }
  
}