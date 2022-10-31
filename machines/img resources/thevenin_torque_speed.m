% Matlab program to calulcate induction motor torque- speed curve
% using the Thevenin equivalent circuit

% First specify the equivalent circuit parameters

vline=480.0;
poles=6;
f=60;
r1=0.461;
r2=0.258;
x1=0.309;
x2=0.507;
xm=30.74;

% Supply connection
Delta=true;
if (Delta) 
    v1=vline;
else % Y-connection
    v1=vline/sqrt(3);
end

% synchronous speed
n_s=120*f/poles;
omega_s=4*pi*f/poles;

% Define Slip range
s=1:-0.01:0; % slip from 1 to 0.01 in 0.01 increments
% Define speed at each slip
n_m=(1-s)*n_s;


% now calculate Thevenin circuit parameters:

zth=(r1+j*x1)*j*xm/(r1+j*(x1+xm));  %complex impedance
rth=real(zth); 
xth=imag(zth);
vth_cmpl=v1*j*xm/(r1+j*(x1+xm));  %complex voltage
vth=abs(vth_cmpl);

% Calculate torque for each slip
% note that the torque for slip=0 isnt calculated, it would cause a
% division by zero. torque=0 at s=0 
for i=1:length(s)-1;
	torque(i)=3*vth^2*(r2/s(i))*(1/omega_s)/((rth+r2/s(i))^2+(xth+x2)^2);
end
torque(length(s))=0;


% now plot torque and speed

plot (n_m,torque);
title('Torque-Speed Curve Example');
xlabel('Mechanical Speed (rpm)');
ylabel('Torque (Nm)');
