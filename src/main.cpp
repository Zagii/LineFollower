#include <Arduino.h>
#include <DRV8835MotorShield.h>

/*
 * This example uses the DRV8835MotorShield library to drive each motor with the
 * Pololu DRV8835 Dual Motor Driver Shield for Arduino forward, then backward. 
 * The yellow user LED is on when a motor is set to a positive speed and off when
 * a motor is set to a negative speed.
 */

#define LED_PIN 13
#define MODE_PIN D2

#define LF_PIN A0
#define BUTTON_PIN 0



//DRV8835MotorShield motors;

void setup()
{
  //motors.setSpeeds(0,0);
  pinMode(LED_PIN, OUTPUT);
  pinMode(MODE_PIN,OUTPUT);
  digitalWrite(MODE_PIN,HIGH);
  pinMode(LF_PIN,INPUT_PULLUP);
  Serial.begin(115200);
  Serial.println("LineFollower start");  
  // uncomment one or both of the following lines if your motors' directions need to be flipped
  
  //motors.flipM1(true);
  //motors.flipM2(true);
  pinMode(BUTTON_PIN,INPUT_PULLUP);

  digitalWrite(LED_PIN,LOW);
  // czeka na guzik
 // while(digitalRead(BUTTON_PIN)==HIGH);
 //motors.setSpeeds(400,0);
 Serial.println("...init ...");


    digitalWrite(D5, HIGH);
    digitalWrite(D7, HIGH);
    analogWrite(D6, 400);
    analogWrite(D8, 400);
  
     delay(3000);
  

// d8 in2EN   // d7 in1PH
// d6 in2EN   // d5  in2PH
// 
/*while(true)
{
  int i=500;
   analogWrite(D6, i);   // analogWrite(D8, i);
   digitalWrite(D5, HIGH); //      digitalWrite(D7, HIGH);
   Serial.println("5h h");
   delay(5000);
   analogWrite(D6, i);   // analogWrite(D8, i);
   digitalWrite(D5, LOW);  //     digitalWrite(D7, LOW);
   Serial.println("5L L");
   delay(5000);
   analogWrite(D6, i); //   analogWrite(D8, i);
   digitalWrite(D7, HIGH); //      digitalWrite(D7, LOW);
   Serial.println("7 h L");
   delay(5000);
   analogWrite(D6, i);    //analogWrite(D8, i);
   digitalWrite(D7, LOW);   //    digitalWrite(D7, HIGH);
   Serial.println("7 L h");
   delay(5000);
}
*/
 //  Serial.println("s1=400");
  //motors.flipM1(true);
 // motors.flipM2(true);
/*   motors.setSpeeds(400,400);
  delay(8000);
  Serial.println("s1 flip");
  motors.flipM1(true);
  motors.setSpeeds(400,400);
  delay(8000);

  motors.flipM2(false);
  Serial.println("s2=400");
   motors.setSpeeds(400,400);
  delay(8000);
  
  Serial.println("s2 flip");
  motors.flipM2(true);
   motors.setSpeeds(400,400);
  delay(8000);
*/
digitalWrite(LED_PIN,HIGH);
  // Wait 1 second and then begin automatic sensor calibration
  // by rotating in place to sweep the sensors over the line
/*  delay(1000);
  int i;
  for(i = 0; i < 80; i++)
  {
    if ((i > 10 && i <= 30) || (i > 50 && i <= 70))
      motors.setSpeeds(-200, 200);
    else
      motors.setSpeeds(200, -200);
    reflectanceSensors.calibrate();

    // Since our counter runs to 80, the total delay will be
    // 80*20 = 1600 ms.
    delay(20);
  }
    motors.setSpeeds(0,0);
  */


  // motors.setSpeeds(0,0);

  
}

unsigned long ms=0;
unsigned long loopTime=0,loopTimeStart=0;
int lfMax=0;
int lfMin=1024;
int m1Speed=0;
int m2Speed=0;
int led=LOW;

double Kp=4.0;
double Kd=6;
int lastError=0;
int position=0;
void lfTryb()
{
   

  // Our "error" is how far we are away from the center of the line, which
  // corresponds to position 2500.
  int16_t error = position - 512;

  // Get motor speed difference using proportional and derivative PID terms
  // (the integral term is generally not very useful for line following).
  // Here we are using a proportional constant of 1/4 and a derivative
  // constant of 6, which should work decently for many Zumo motor choices.
  // You probably want to use trial and error to tune these constants for
  // your particular Zumo and line course.
  int16_t speedDifference = error * Kp + Kd * (error - lastError);

  lastError = error;

  // Get individual motor speeds.  The sign of speedDifference
  // determines if the robot turns left or right.
  m1Speed = MAX_SPEED - speedDifference;
  m2Speed = MAX_SPEED + speedDifference;

  // Here we constrain our motor speeds to be between 0 and MAX_SPEED.
  // Generally speaking, one motor will always be turning at MAX_SPEED
  // and the other will be at MAX_SPEED-|speedDifference| if that is positive,
  // else it will be stationary.  For some applications, you might want to
  // allow the motor speed to go negative so that it can spin in reverse.
  if (m1Speed < 0)
    m1Speed = 0;
  if (m2Speed < 0)
    m2Speed = 0;
  if (m1Speed > MAX_SPEED)
    m1Speed = MAX_SPEED;
  if (m2Speed > MAX_SPEED)
    m2Speed = MAX_SPEED;

analogWrite(D6, m1Speed);
analogWrite(D8, m2Speed);
 // motors.setSpeeds(m1Speed, m2Speed);

}

#define STOP 0
#define LF 1
#define MANUAL 2
int tryb=1;

void loop()
{
  loopTimeStart=millis();
  delay(1);
  position=analogRead(LF_PIN);
    if(position>lfMax)lfMax=position;
    if(position<lfMin)lfMin=position;
  
  /*if(digitalRead(BUTTON_PIN)==LOW)
  {
    delay(20);
    if(digitalRead(BUTTON_PIN)==LOW)
    tryb++;
    if(tryb>LF)tryb=STOP;
    //motors.setSpeeds(0,0);
  }*/
  switch(tryb)
  {
    case STOP:
      //motors.setSpeeds(0,0);
      break;
    case LF:
      lfTryb();
    break;
    case MANUAL:
      break;
  }
  if(millis()-ms>1000)
  {
    String s="LoopTime: "+String(loopTime)+" ms";
    s+=" LFinp: "+String(position)/*+" ["+String(lfMin)+", "+String(lfMax)+"]"*/;
    s+=" L: "+String(m1Speed)+", P: "+String(m2Speed)+", Kp: "+String(Kp)+", Kd: "+String(Kd);
    s+=" Tryb: "+String(tryb)+" err: "+lastError;
    Serial.println(s);
    if(led==LOW)led=HIGH;else led=LOW;
    //digitalWrite(LED_PIN,led);
    ms=millis();
  }
  // run M1 motor with positive speed
  
  //digitalWrite(LED_PIN, HIGH);
  /*
  for (int speed = 0; speed <= 400; speed++)
  {
    motors.setM1Speed(speed);
    delay(2);
  }

  for (int speed = 400; speed >= 0; speed--)
  {
    motors.setM1Speed(speed);
    delay(2);
  }
  
  // run M1 motor with negative speed
  
  digitalWrite(LED_PIN, LOW);
  
  for (int speed = 0; speed >= -400; speed--)
  {
    motors.setM1Speed(speed);
    delay(2);
  }
  
  for (int speed = -400; speed <= 0; speed++)
  {
    motors.setM1Speed(speed);
    delay(2);
  }

  // run M2 motor with positive speed
  
  digitalWrite(LED_PIN, HIGH);
  
  for (int speed = 0; speed <= 400; speed++)
  {
    motors.setM2Speed(speed);
    delay(2);
  }

  for (int speed = 400; speed >= 0; speed--)
  {
    motors.setM2Speed(speed);
    delay(2);
  }
  
  // run M2 motor with negative speed
  
  digitalWrite(LED_PIN, LOW);
  
  for (int speed = 0; speed >= -400; speed--)
  {
    motors.setM2Speed(speed);
    delay(2);
  }
  
  for (int speed = -400; speed <= 0; speed++)
  {
    motors.setM2Speed(speed);
    delay(2);
  }
  
  delay(500);
  */
 loopTime=millis()-loopTimeStart;
}