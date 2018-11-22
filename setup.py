from setuptools import setup

setup(
    name='canvas_resource',
    packages=['canvas_resource'],
    include_package_data=True,
    install_requires=[
        'flask',
        'colorama',
    ],
)