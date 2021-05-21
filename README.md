# TS Raytracer

## Demo URL


### Example Script

```
@screen_width 1024
@screen_height 768

object::sphere s1 {
    center: {0, -1, 3};
    radius: 1;
    color: {212, 32, 13};
    specular: 1000;
}

object::sphere s2 {
    center: {1.5, 0.5, 5};
    radius: 1;
    color: {32, 212, 13};
}

object::sphere s3 {
    center: {-1.5, 2, 7};
    radius: 1;
    color: {13, 32, 212};
    specular: 500;
}

light::ambient la {
    intensity: {0.3, 0.3, 0.6};
}

light::point lp {
    intensity: {0.3, 0.3, 0.6};
    position: {0, 1, -1};
}

light::directional ld {
    intensity: {0.3, 0.3, 0.6};
    direction: {1, 1, 4};
}
```