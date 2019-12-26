class Helper
{
    static countDefinedValues(array)
    {
        return array.filter(function (value)
        {
            return value !== undefined
        }).length;
    }

    static mouseLeftClick(evt)
    {
        let flag = false;

        evt = evt || window.event;

        if ('buttons' in evt)
        {
            flag = evt.buttons === 1;
        }

        if (!flag)
        {
            let button = evt.which || evt.button;

            flag = button === 1;
        }

        return flag;
    }

    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static playSound(sound)
    {
        sound.pause();
        sound.currentTime = 0;
        sound.play().then(() => {}).catch(() => {})
    }

    /*
    Delete an element from an array without
    having to create a new array in the process
    to keep garbage collection at a minimum
    */
    static removeIndex(array, index)
    {

        if (index >= array.length)
        {
            console.error('ERROR: index is out of range');
            return;
        }

        if (array.length <= 0)
        {
            console.error('ERROR: empty array');
            return;
        }

        array[index] = array[array.length - 1];
        array[array.length - 1] = undefined;

        array.length = array.length - 1;
    }
}