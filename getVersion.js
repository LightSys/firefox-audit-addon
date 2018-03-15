var getting = distribution.iniFile.exists.appversion.get({});


getting.then((got) => {

    console.log('Value: ${got.value}');
    console.log('Control: ${got.levelOfControl}');

});

