import React, {useEffect, useRef, useState} from "react";
import './vertify.css'

// eslint-disable-next-line no-unused-vars
interface CaptchaResult {
    /** 验证码类型.*/
     type: string;
    /** 背景图.*/
     backgroundImage: string;
    /** 移动图.*/
     templateImage: string;
    /** 背景图片所属标签. */
     backgroundImageTag: string;
    /** 模板图片所属标签. */
     templateImageTag: string;
    /** 背景图片宽度.*/
    backgroundImageWidth: number;
    /** 背景图片高度.*/
    backgroundImageHeight: number;
    /** 滑动图片宽度.*/
    templateImageWidth: number;
    /** 滑动图片高度.*/
    templateImageHeight: number;
}
interface ITrackProps {
    x: number,
    y: number,
    t: number
}



const Vertify: React.FC = () => {
    const [visible, setVisible] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [count, setCount] = useState(0);
    const isMouseDown =useRef(false);

    const [currentCaptchaId, setCurrentCaptchaId] = useState('');
    const [sliderSrc, setSliderSrc] = useState('');
    const [backgroundSrc, setBackgroundSrc] = useState('');

    const sliderTranslate = useRef('translate(0px, 0px)');
    const btnTranslate = useRef('translate(0px, 0px)');
    const bgTranslate = useRef('translate(0px, 0px)');
    const originYRef = useRef(0);
    const originXRef = useRef(0);
    // const trackList = useRef([]);
    const startSlidingTime = useRef<Date | null>(null);
    const endSlidingTime =useRef<Date | null>( null);
    const [translate, setTranslate] = useState('translate(0px, 0px)')
    const [trackList] = useState<ITrackProps []>([])

    const test = () => {
        let num = count + 10
        setCount(num)
        btnTranslate.current = 'translate(' + num + 'px, 0px)'
        sliderTranslate.current = 'translate(' + num + 'px, 0px)'
        setTranslate('translate(' + num + 'px, 0px)')
    }


    /**
     * 后端请求
     */
    const initCaptchaData = () => {
        fetch('http://localhost:7001/tt')
            .then(response => response.json())
            .then(data => {
                const captcha: CaptchaResult = data.captcha;
                setCurrentCaptchaId(data.id)
                setBackgroundSrc(captcha.backgroundImage)
                setSliderSrc(captcha.templateImage)

            })
            .catch(error => console.log('Error', error))
    }


    /** 行为方法**/
    const handleDragStart = (ev: (TouchEvent | MouseEvent)) => {
        console.log("方法1")
        //获取拖拽起始坐标
        if (!isMouseDown.current) return;
        console.log("开始")
        const originX = ev instanceof MouseEvent ? ev.clientX : ev.touches[0].clientX;
        const originY = ev instanceof MouseEvent ? ev.clientY : ev.touches[0].clientY;
        startSlidingTime.current = new Date()
        originXRef.current = originX
        originYRef.current = originY

    }
    const handleDragMove = (ev: (TouchEvent | MouseEvent)) => {

        if (! isMouseDown.current) return false;
        console.log('方法2')
        const w = 206;//滑道宽度
        // 获取拖拽移动的距离
        const eventX = ev instanceof MouseEvent ? ev.clientX : ev.touches[0].clientX;
        const eventY = ev instanceof MouseEvent ? ev.clientY : ev.touches[0].clientY;
        let moveX =  eventX - originXRef.current;
        let moveY = eventY - originYRef.current;

        //验证码超时
        if (trackList.length > 2000) {
            //调用reset重装数据
            return;
        }
        if (moveX < 0) {
            moveX = 0;
        } else if (moveX > w) {
            moveX = w;
        } else {
            setTranslate('translate(' + moveX + 'px, 0px)')
            let track: ITrackProps = {x: moveX, y: moveY, t: new Date().getTime() - (startSlidingTime.current?.getTime() as number)}
            trackList.push(track)
        }
    }
    const onHandleDrag =  () => {
        isMouseDown.current = true
    }
    /**滑块移动事件**/
    const handleDragEnd = (ev: (TouchEvent | MouseEvent)) => {
        if (!isMouseDown.current) return;
        isMouseDown.current = false
        console.log('end')
        const eventX = ev instanceof MouseEvent ? ev.clientX : ev.changedTouches[0].clientX;
        if (eventX === originYRef.current) {
            //验证码错误直接返回
            return false;
        }
        endSlidingTime.current = new Date();
        sliderTranslate.current = 'translate(0px, 0px)'
        btnTranslate.current = 'translate(0px, 0px)'
        //后端验证
        valid();
        return true;
    }

    /**二维码验证**/
    const valid = () => {

    }

    /**reset验证码数据**/
    const reset = () => {

    }

    useEffect(() => {
        if (visible) {
            initCaptchaData()
            //添加监听事件
            //触摸事件
            window.addEventListener('touchstart', handleDragStart);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
            // //鼠标事件
            window.addEventListener('mousedown', handleDragStart);
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
        }
    },[visible]) //eslint-disable-line



    // @ts-ignore
    return (
        <div className="slider">
            <div className="content">
                <div className="bg-img-div" style={{transform: bgTranslate.current}}>
                    <img id="bg-img" src={backgroundSrc}/>
                </div>
                <div className="slider-img-div" style={{transform: translate}}>
                    <img id="slider-img" src={sliderSrc}/>
                </div>
            </div>
            <div className="slider-move">
                <div className="slider-move-track">
                    拖动滑块完成拼图
                </div>
                <div className="slider-move-btn" style={{transform: translate}} onMouseDown={onHandleDrag} onTouchStart={onHandleDrag}/>
            </div>
        </div>
    )
}

export default Vertify